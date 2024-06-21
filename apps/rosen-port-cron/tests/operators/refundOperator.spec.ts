import { describe, expect, it } from 'vitest';
import { IRefundTxChecker } from '../../src/operators/refundOperator/refundTxChecker';
import { IRefundStoreClient } from '../../src/operators/refundOperator/storeClient';
import { IWalletClient } from '../../src/types/executor';
import { TestWalletClientFactory } from './testClasses/TestWalletClient';
import {
  TestRefundStoreClientFactory,
  TestRefundTxChecker,
} from './testClasses/RefundOperatorClasses';
import { RefundOperator } from '../../src/operators';
import { refunds } from './mock';
import { testRosenUI } from '../testUtils/testRosenUI';
import { RefundStatus } from '@rosen-port/db';
import { RefundInvalidException } from '../../src/errors/refundErrors';

var refundClient: IRefundStoreClient = TestRefundStoreClientFactory.generate();
var refundTxChecker: IRefundTxChecker = new TestRefundTxChecker(refundClient);
var walletClient: IWalletClient = TestWalletClientFactory.generate();
const unconfirmedRefund = refunds[0];
const confirmedRefund = refunds[1];

describe('RefundOperator', async () => {
  describe('execute', async () => {
    it('fails with unconfirmed refund', async () => {
      const refundOperator = new RefundOperator(
        unconfirmedRefund,
        refundClient,
        testRosenUI,
        refundTxChecker,
        walletClient
      );

      await expect(
        async () => await refundOperator.execute()
      ).rejects.toThrowError();
    });

    /**
     * @todo kii Complete this
     */
    test.skip('passes with confirmed refund', async () => {
      const refundOperator = new RefundOperator(
        confirmedRefund,
        refundClient,
        testRosenUI,
        refundTxChecker,
        walletClient
      );

      await refundOperator.execute();
    });
  });

  it('ensureRefundValid', async () => {
    const refundOperator = new RefundOperator(
      unconfirmedRefund,
      refundClient,
      testRosenUI,
      refundTxChecker,
      walletClient
    );

    const testRefundInvalidStatus = async (status: RefundStatus) => {
      var refund = unconfirmedRefund;

      refund.status = status;
      expect(refund.status).toBe(status);
      await expect(
        async () => await refundOperator.ensureRefundValid(refund)
      ).rejects.toThrowError(
        new RefundInvalidException(`Refund Invalid: ${refund.id}`)
      );
    };

    const testRefundValidStatus = async () => {
      var refund = confirmedRefund;
      expect(refund.status).toBe(RefundStatus.refund_valid);
      await expect(
        refundOperator.ensureRefundValid(refund)
      ).resolves.toBeFalsy();
    };

    await testRefundInvalidStatus(RefundStatus.refund_initiated);
    await testRefundInvalidStatus(RefundStatus.refund_service_fee_signed);
    await testRefundInvalidStatus(RefundStatus.refund_in_process);
    await testRefundInvalidStatus(RefundStatus.refund_processed);
    await testRefundInvalidStatus(RefundStatus.refund_completed);
    await testRefundValidStatus();
  });

  // @todo kii refund tx tests needs impl
  describe('refundTx', async () => {});

  describe('updateRefundTxInDb', async () => {
    const refundOperator = new RefundOperator(
      unconfirmedRefund,
      refundClient,
      testRosenUI,
      refundTxChecker,
      walletClient
    );

    const refundTxId = 'refundTxId1';
    await expect(
      async () =>
        await refundOperator.updateRefundTxInDb(
          unconfirmedRefund.txToRefund.initiatedTxId,
          refundTxId
        )
    ).toBeTruthy();
  });
});
